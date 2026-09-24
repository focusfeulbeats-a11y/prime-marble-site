export const config = { api: { bodyParser: { sizeLimit: "20mb" } } };

function extractJSON(text) {
  const cleaned = text.replace(/^```json\s*/i,"").replace(/```$/,"").trim();
  try { return JSON.parse(cleaned); } catch {}
  const a=cleaned.indexOf("{"), b=cleaned.lastIndexOf("}");
  if(a>=0&&b>a) return JSON.parse(cleaned.slice(a,b+1));
  throw new Error("AI did not return valid scene JSON");
}

export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"POST only"});
 if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured in Vercel"});
 try{
   const {projectType,dimensions,brief,material,images=[]}=req.body||{};
   const content=[{
     type:"input_text",
     text:`You are the spatial design engine for Prime Marble Specialists in London.
Analyse the customer's room photos and supplied measurements. Do not invent exact dimensions that cannot be inferred.
Create a practical premium natural-stone concept.

Project type: ${projectType||"unspecified"}
Measured room: ${JSON.stringify(dimensions||{})}
Customer brief: ${brief||"No extra brief"}
Chosen stone/material: ${material||"Not selected"}

Return ONLY valid JSON with this shape:
{
 "summary":"short customer-facing explanation",
 "render_prompt":"detailed photorealistic interior rendering prompt that preserves the photographed room architecture and applies the requested stone design",
 "scene":{
   "room":{"width_m":number,"length_m":number,"height_m":number},
   "objects":[
     {"type":"wall|cabinet|worktop|island|vanity|splashback|feature_wall|floor|step|sink|hob",
      "name":"string","position":[x,y,z],"size":[width,height,depth],
      "material":"stone|wood|metal|wall","stone":"string"}
   ]
 }
}
Coordinates and sizes are metres. Use supplied measurements as the source of truth. Keep geometry buildable and simple enough for a browser 3D renderer.`
   }];
   for(const image of images.slice(0,4)){
     if(typeof image==="string"&&image.startsWith("data:image/")) content.push({type:"input_image",image_url:image,detail:"high"});
   }

   const vision=await fetch("https://api.openai.com/v1/responses",{
     method:"POST",
     headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
     body:JSON.stringify({model:"gpt-5.6-terra",input:[{role:"user",content}]})
   });
   const vr=await vision.json();
   if(!vision.ok) throw new Error(vr?.error?.message||"Room analysis failed");
   const text=(vr.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n") || vr.output_text;
   const design=extractJSON(text);

   const imageInput=[{type:"input_text",text:`Create a photorealistic premium interior renovation concept for Prime Marble Specialists. ${design.render_prompt}. Preserve the room layout, openings, perspective and major fixed features from the reference photo. The supplied measurements and requested stone are authoritative. No text, labels, people or logos.`}];
   if(images[0]) imageInput.push({type:"input_image",image_url:images[0]});

   const render=await fetch("https://api.openai.com/v1/responses",{
     method:"POST",
     headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
     body:JSON.stringify({
       model:"gpt-5.6-terra",
       input:[{role:"user",content:imageInput}],
       tools:[{type:"image_generation",model:"gpt-image-2",quality:"high",size:"1536x1024"}],
       tool_choice:{type:"image_generation"}
     })
   });
   const rr=await render.json();
   if(!render.ok) throw new Error(rr?.error?.message||"Concept render failed");
   const image=(rr.output||[]).find(x=>x.type==="image_generation_call")?.result ||
               (rr.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==="output_image")?.image_base64 || null;

   return res.status(200).json({summary:design.summary,scene:design.scene,image});
 }catch(e){
   console.error(e);
   return res.status(500).json({error:e.message||"Generation failed"});
 }
}
