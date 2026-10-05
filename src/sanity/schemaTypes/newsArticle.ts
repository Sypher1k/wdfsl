import { defineField, defineType } from 'sanity';
export default defineType({ name:'newsArticle', title:'News Article', type:'document', fields:[
 defineField({name:'title',title:'Title',type:'string',validation:r=>r.required()}),
 defineField({name:'slug',title:'Slug',type:'slug',options:{source:'title',maxLength:96},validation:r=>r.required()}),
 defineField({name:'excerpt',title:'Excerpt',type:'text',rows:3,validation:r=>r.max(280)}),
 defineField({name:'category',title:'Category',type:'string',options:{list:['News','Events','Announcements','Media']},initialValue:'News'}),
 defineField({name:'publishedAt',title:'Published date',type:'datetime',validation:r=>r.required()}),
 defineField({name:'author',title:'Author',type:'string'}),
 defineField({name:'featured',title:'Featured on newsroom',type:'boolean',initialValue:false}),
 defineField({name:'mainImage',title:'Main image',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Alternative text',type:'string',validation:r=>r.required()})]}),
 defineField({name:'body',title:'Article body',type:'array',of:[{type:'block'},{type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Alternative text',type:'string'})]}]}),
],preview:{select:{title:'title',media:'mainImage',subtitle:'category'}},orderings:[{title:'Published date, newest first',name:'publishedAtDesc',by:[{field:'publishedAt',direction:'desc'}]}]});
