import { defineConfig } from 'sanity'; import { visionTool } from '@sanity/vision'; import { schemaTypes } from './src/sanity/schemaTypes';
export default defineConfig({name:'wdf',title:'WDF Hambantota',projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID||'',dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',plugins:[visionTool()],schema:{types:schemaTypes}});
