This is an experiment trying to indentify if a ML model will be more efficient in indentifying and cropping objects in images than a normal color separation logic.

## Project phases

Step 1 - create a normal cropping tool using Jimp
- status: DONE
- demo: https://image-editor-micro-saas.vercel.app/api/autocrop?image={encodedImgUrl}

Step 2 - identify objects in images using Tensorflow
- status: IN PROGRESS
- TBD

## Assumptions and limitations
- Jimp version will be able to crop images placed on an relatively even background, while Tensorflow object identification promisses to work on any image and even identify multiple objects in the same picture
- Jimp version will work on node runtime and will be deployed on vercel serverless functions
- Tensorflow version will work on python and will be deployed on vercer serverless functions

## How to run
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/api/autocrop?image={encodedImgUrl}](http://localhost:3000/api/autocrop?image={encodedImgUrl}) with your browser to see the result.

You can start editing the script by modifying `app/api/autocrop/route.ts`. The page auto-updates as you edit the file.
