const n="https://d1q0vy0v52gyjr.cloudfront.net";async function r(){const t=await fetch(`${n}/hub.json`);if(!t.ok)throw new Error("Failed to fetch hub data");return t.json()}function c(t,o,e){return t?`${t}&size=${o}x${e}&format=webp`:""}async function s(t){const o=await fetch(`${n}/collections/${t}.json`);if(!o.ok)throw new Error(`Failed to fetch collection ${t}`);return o.json()}export{s as a,r as f,c as g};
