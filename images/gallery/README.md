# Gallery

The **Gallery** section on the site auto-generates its albums from this folder — no code changes needed.

## How it works

1. Create a new folder in `images/gallery/`, named after the album (e.g. `Fall Scrimmage 2026`).
2. Drop your photos into it (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, or `.avif`).
3. Commit and push to `main`.

That's it — the site reads the folder listing live from GitHub, so the new album shows up automatically the next time someone loads the page (allow a few minutes for browsers with a cached page listing to refresh).

## Notes

- Folder names become the album title. Dashes and underscores are turned into spaces (`fall_lan_2026` → "Fall Lan 2026").
- The first photo (alphabetically) in a folder is used as the album cover.
- Empty folders, or folders with no image files, are skipped.
- Files placed directly in `images/gallery/` (not inside a subfolder) are ignored — only subfolders become albums.
