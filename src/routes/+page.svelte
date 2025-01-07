<script>
    export let data; // Data passed from `+page.ts`
</script>
  
<div class="p-6">
<h1 class="text-2xl font-bold">Recent Papers</h1>
<ul class="mt-4">
    {#each data.papers as paper}
    <li class="mt-2 p-4 border rounded bg-gray-50">
        <h2 class="text-lg font-semibold">
        <a href={paper.link} target="_blank" class="text-blue-500 hover:underline">
            {paper.title}
        </a>
        </h2>
        <p class="text-sm text-gray-600">Published: {paper.published}</p>
        <p class="text-sm text-gray-600">Authors: {paper.author.join(', ')}</p>
        <p class="mt-2 text-gray-800">{paper.summary}</p>
    </li>
    {/each}
</ul>
</div>
  