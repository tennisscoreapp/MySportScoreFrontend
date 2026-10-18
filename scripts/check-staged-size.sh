#!/bin/sh
# Pre-commit check: rejects staged files over 5,000 tokens, counted as bytes / 4.
# Agents read whole files into their context, so large files are split before commit.
# Binary files and files marked linguist-generated in .gitattributes (lockfiles,
# codegen) are not written by agents and are skipped.

max_tokens=5000
max_bytes=$((max_tokens * 4))
tab=$(printf '\t')
over=""

# numstat prints "-" instead of line counts for binary files.
staged=$(git -c core.quotePath=false diff --cached --numstat --no-renames --diff-filter=ACM)
while IFS="$tab" read -r added _ path; do
	[ -n "$path" ] && [ "$added" != "-" ] || continue
	bytes=$(git cat-file -s ":$path")
	[ "$bytes" -gt "$max_bytes" ] || continue
	case $(git check-attr linguist-generated -- "$path") in
		*": set" | *": true") continue ;;
	esac
	over="$over  $(((bytes + 3) / 4)) tokens  $path
"
done <<LIST
$staged
LIST

[ -z "$over" ] && exit 0

cat >&2 <<MSG
Commit blocked: these staged files are over $max_tokens tokens (bytes / 4, so $max_bytes bytes):

$over
Split each file so every part is under $max_tokens tokens, then commit again:
  - Find the seams: separate components, custom hooks, helper functions, types and constants.
  - Move each part into its own file next to the original, for example GroupClient.tsx ->
    GroupClient.tsx (layout only), GroupStandingsTable.tsx, useGroupMatches.ts, groupTypes.ts.
  - Import the moved parts back into the original file. If other files import those names
    from the original path, re-export them there or update the imports.
  - Tests: split a large spec by feature, one test.describe block per file.
  - Keep behavior identical: move code as-is, do not rewrite it while splitting.
  - Aim well below the limit (about 3,000 tokens per file) so the next edit does not hit it again.
  - Markdown: move whole sections into separate files under docs/ and link them from the original.
  - Stage the new files and the shortened original with git add, then run git commit again.

If a file is a lockfile or generated code, add "<path> linguist-generated" to .gitattributes instead.
MSG
exit 1
