window.onload = () => {
    fetch('../assets/eula.txt').then(res => res.text()).then(data => {
        document.getElementById('eula-text').value = data;
    });
};

function acceptEULA() {
    document.getElementById('eula').style.display = 'none';
    document.getElementById('installer').style.display = 'block';
}

async function install() {
    const installPath = document.getElementById('path').value;
    const builds = await window.api.getBuilds();
    const latest = builds[0].version;

    const logs = await window.api.install(latest, installPath);

    document.getElementById('installer').style.display = 'none';
    document.getElementById('logs').style.display = 'block';
    document.getElementById('logOutput').innerText = logs;

    setTimeout(() => {
        document.getElementById('logs').style.display = 'none';
        document.getElementById('complete').style.display = 'block';
    }, 3000);
}
