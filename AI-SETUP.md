# Prime Marble AI Designer setup

1. Upload the contents of this folder to the GitHub repository root.
2. In Vercel open Project > Settings > Environment Variables.
3. Add `OPENAI_API_KEY` with your OpenAI API key. Never put the key in GitHub or HTML.
4. Redeploy the project.
5. Open `/ai-designer.html`, add room photos, measurements, a design brief and stone, then click Generate Concept.

The endpoint uses OpenAI vision to turn the customer's photos + measurements into structured scene JSON, then requests a photorealistic image concept. The existing browser 3D view remains as the interactive fallback/editable view.
