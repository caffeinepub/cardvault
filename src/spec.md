# Specification

## Summary
**Goal:** Enable users to share their business cards via a public link that anyone can view without authentication.

**Planned changes:**
- Add a public backend endpoint that retrieves business cards by principal ID without requiring authentication
- Add a "Share" button to the business card page that generates a shareable URL
- Create a public view page that displays read-only business cards accessed via sharing links
- Implement copy-to-clipboard functionality with visual feedback for the shareable URL

**User-visible outcome:** Users can generate and share a link to their business card, and recipients can view the card without needing to log in or have an account.
