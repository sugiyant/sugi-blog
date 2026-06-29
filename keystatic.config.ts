import { config, collection, fields } from '@keystatic/core';

export default config({
	storage: {
   
   kind: 'github',
   repo: {
     owner: sugiyant,
     name: sugi-blog
   }   
},
  
  collections: {
    posts: collection({
      label: 'Postingan',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Judul' },
        }),
        description: fields.text({
          label: 'Deskripsi',
          description: 'Ringkasan singkat, dipakai untuk SEO dan daftar postingan',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: 'Tanggal Publish',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Tanggal Update (opsional)',
        }),
        content: fields.markdoc({
          label: 'Konten',
          extension: 'md',
        }),
      },
    }),
  },
});
