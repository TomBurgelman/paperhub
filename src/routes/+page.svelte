<script>
    export let data;
  </script>
  
  <div class="p-6">
    <h1 class="text-2xl font-bold">Recent Papers</h1>
    <ul class="mt-4">
      {#each data.papers as paper}
        <li class="mt-2 p-4 border rounded bg-gray-50">
          <h2 class="text-lg font-semibold">{paper.title}</h2>
          <p class="text-sm text-gray-600">Published: {paper.date} by {paper.author}</p>
        </li>
      {/each}
    </ul>
  </div>