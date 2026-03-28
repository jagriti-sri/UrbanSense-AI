# Urban Sense Frontend

Separated React frontend built from the single-file Urban Sense HTML/React concept.

## Run locally

```bash
npm install
npm run dev
```

## Pages included

- Landing page
- Dashboard
- Air page
- Rainfall page
- Waste page
- Land usage page
- About page
- Contact page
- Profile page

## Easy backend integration points

- `src/services/api.js`
- Form submit handlers inside `WastePage.jsx`, `LandPage.jsx`, and `ContactPage.jsx`
- Replace mock content in `src/data/mockData.js` with API responses

## Important

This project includes `lucide-react` in `package.json`, so the import error you saw should be solved after running `npm install`.
