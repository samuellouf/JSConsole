let version = '1.0';

let console = document.getElementById('console');
let textarea_div = document.getElementById('input');
let textarea = document.querySelector('#input textarea');

const sleep = (ms) => { return new Promise((resolve) => { setTimeout(resolve, ms); });};

// `<pre><code class="language-css">p { color: red }</code></pre>`

function stringify(string){
  if (string.includes('\'') && string.includes('\"') && string.includes('\`')){
    return `'${string.replaceAll('\'', '\\\'')}'`;
  } else if (string.includes('\'')){
    return `"${string}"`;
  } else if (string.includes('\"')){
    return `'${string}'`;
  } else if (string.includes('\`')){
    return `'${string}'`;
  }
  return `'${string}'`;
}

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
    const executeCode = (code) => {
      var result = eval(code);
      let response_div = document.createElement('div');
      response_div.classList.add('response');
      console.appendChild(response_div);
      console.appendChild(textarea_div);
      if (result instanceof Promise) {
      } else {
        let response_pre = document.createElement('pre');
        let response_code = document.createElement('code');
        response_pre.appendChild(response_code);
        if (typeof result == 'string'){
          result = stringify(result);
        } else if (typeof result == 'function'){
          result = 'ƒ ' + result;
        }
        response_code.innerHTML = result;
        response_pre.classList.add('language-javascript');
        console.appendChild(response_pre);
        Prism.highlightElement(response_pre);
        response_div.appendChild(response_pre);
      }
    }
    // await result;
    executeCode(value);
  };
  execute_();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('span.version').innerText = version;
})