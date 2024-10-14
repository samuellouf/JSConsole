let version = '1.0';

let console = document.getElementById('console');
let textarea_div = document.getElementById('input');
let textarea = document.querySelector('#input textarea');

const sleep = (ms) => { return new Promise((resolve) => { setTimeout(resolve, ms); });};

// `<pre><code class="language-css">p { color: red }</code></pre>`

function execute(){
  const execute_ = async () => {
    let executed_code = document.createElement('pre');
    let code = document.createElement('code');
    executed_code.appendChild(code);
    code.innerHTML = textarea.value;
    executed_code.classList.add('language-javascript');
    console.appendChild(executed_code);
    Prism.highlightElement(executed_code);
    console.appendChild(textarea_div);
    let value = textarea.value;
    textarea.value = '';
    document.querySelector('#input code').innerHTML = '';
    scrollTo(0, window.outerHeight);
    await sleep(1);
    var result = eval(value);
    // await result;
  };
  execute_();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('span.version').innerText = version;
})