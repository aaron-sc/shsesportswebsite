# Events calendar

The **Events** section on the site reads its schedule from [`events.json`](events.json) — no code changes needed to update it.

## How to add an event

Open `events.json` (you can edit it right in GitHub — click the file, click the pencil icon) and add an entry to the array:

```json
{
  "date": "2026-08-15",
  "time": "6:00 PM",
  "title": "Fall Tryouts",
  "team": "All Teams",
  "type": "Tryouts",
  "location": "Sentinel HS Library"
}
```

Full example with two events:

```json
[
  {
    "date": "2026-08-15",
    "time": "6:00 PM",
    "title": "Fall Tryouts",
    "team": "All Teams",
    "type": "Tryouts",
    "location": "Sentinel HS Library"
  },
  {
    "date": "2026-09-05",
    "time": "4:30 PM",
    "title": "Scrimmage vs. Hellgate",
    "team": "Varsity",
    "type": "Scrimmage",
    "location": "Online"
  }
]
```

Commit and push — the site fetches this file live, so the change shows up the next time someone loads the page.

## Fields

| Field      | Required | Notes                                                              |
|------------|----------|----------------------------------------------------------------------|
| `date`     | yes      | `YYYY-MM-DD` format                                                  |
| `title`    | yes      | Event name                                                           |
| `time`     | no       | Free text, e.g. `"6:00 PM"` — omit for all-day/TBD                   |
| `team`     | no       | e.g. `"Varsity"`, `"JV"`, `"All Teams"` — shown as a small pill tag   |
| `type`     | no       | e.g. `"Scrimmage"`, `"Tournament"`, `"Tryouts"`, `"Practice"`         |
| `location` | no       | Free text, e.g. `"Sentinel HS Library"` or `"Online"`                |

## Notes

- Events are shown in chronological order automatically.
- Past events (before today) drop off the list automatically — no need to delete them, though you're free to remove old entries to keep the file tidy.
- If the array is empty (`[]`), the section shows a "no upcoming events" message instead of an empty list.
