<script lang="ts">
    import { onMount } from 'svelte';
    import katex from 'katex';
    import 'katex/dist/katex.min.css';
    export let data; // Data passed from `+page.ts`
    let selectedQuery = 'hep-th';
    let queries = ['astro-ph', 'cond-mat', 'gr-qc', 'hep-ex', 'hep-lat', 'hep-ph', 'hep-th',
        'math-ph', 'nlin', 'nucl-ex', 'nucl-th',
        'physics', 'quant-ph', 'math', 'cs',
        'q-bio', 'q-fin', 'stat', 'eess', 'econ',];

    let subqueries = ['astro-ph.GA', 'astro-ph.CO', 'astro-ph.EP',
        'astro-ph.HE', 'astro-ph.IM', 'astro-ph.SR', 'cond-mat.dis-nn', 'cond-mat.mes-hall',
        'cond-mat.mtrl-sci', 'cond-mat.other', 'cond-mat.quant-gas',
        'cond-mat.soft', 'cond-mat.stat-mech', 'cond-mat.str-el',
        'cond-mat.supr-con',];

    let title = '';
    let isLoading = false;

    async function fetchPapers() {
        isLoading = true;
        const res = await fetch(`/api/papers?query=${selectedQuery}&title=${title}&start=0&maxResults=100`);
        data.papers = await res.json();
        isLoading = false;
        renderMathJax();
        renderKaTeX();
    }

    onMount(() => {
        fetchPapers();
    });

    function renderMathJax() {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }

    function renderKaTeX() {
        document.querySelectorAll('.latex').forEach((el) => {
            katex.render(el.textContent, el, {
                throwOnError: false
            });
        });
    }

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b})`;
    }

    let dropdownOpen = true;

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            fetchPapers();
        }
    }
</script>

<div class="p-6">
    <h1 class="text-2xl font-bold">Recent Papers</h1>
    <div class="mb-4">
        <input type="text" bind:value={title} placeholder="Search by title" class="p-2 border rounded-md w-full mb-2" on:keypress={handleKeyPress} />
        <button on:click={fetchPapers} class="p-2 bg-blue-500 text-white rounded-md">Search</button>
        <div class="flex overflow-x-auto space-x-2">
            {#each queries as query}
                <button on:click={() => { selectedQuery = query; fetchPapers(); }} 
                    class="p-1 m-1 rounded-lg text-center min-w-24 shadow-lg transition-transform duration-200"
                    style="background-color: {getRandomColor()}; opacity: {selectedQuery === query ? 1 : 0.4}; transform: scale({selectedQuery === query ? 1.1 : 1});
                    font-weight: {selectedQuery === query ? 'bold' : 'normal'};">
                    {query}
                </button>
            {/each}
        </div>
    </div>
    {#if isLoading}
    <div class="loader"></div>
    {:else}
    <ul class="mt-4">
        {#each data.papers as paper}
        <li class="mt-2 p-4 border rounded-md bg-gray-50"> 
            <h2 class="text-lg font-semibold latex">
            <a href={paper.link} target="_blank" class="text-blue-500 hover:underline font-bold">
                {paper.title}
            </a>
            </h2>
            <div class="flex justify-left space-x-1">
                <p class="text-sm text-gray-600 font-semibold">Published:</p>
                <p class="text-sm text-gray-600 italic">{paper.published}</p>
            </div>
            <div class="flex justify-left space-x-1">
                <p class="text-sm text-gray-600 font-semibold">Authors:</p>
                {#if paper.author.length > 4}
                <p class="text-sm text-gray-600 italic">{paper.author[0]} , et. al</p>
                {:else}
                <p class="text-sm text-gray-600 italic">{paper.author.join(', ')}</p>
                {/if}
            </div>
            <div class="flex justify-left space-x-1">
                <p class="text-sm text-gray-600 font-semibold">Citations:</p>
                <p class="text-sm text-gray-600 italic">{paper.citationCount}</p>
            </div>
            <p class="mt-2 text-gray-800 latex">{paper.summary}</p>
        </li>
        {/each}
    </ul>
    {/if}
</div>

<style>
    .loader {
        border: 4px solid #f3f3f3;
        border-radius: 50%;
        border-top: 4px solid #3498db;
        width: 24px;
        height: 24px;
        animation: spin 2s linear infinite;
        margin: auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
