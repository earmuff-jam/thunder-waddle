async function fetchData() {
    const url = "https://api.goprogram.ai/inspiration";
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
        },
        redirect: "follow"
    }).then(response => response.json());
    document.getElementById("author").innerHTML = response?.author;
    document.getElementById("quote").innerHTML = response?.quote;
}
fetchData();

