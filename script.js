let version = '1.3';

const sleep = (ms) => { return new Promise((resolve) => { setTimeout(resolve, ms); });};
const isClass = (element) => {
  try {
    window[element.name]();
    return false;
  } catch (e) {
    if (e.message.includes('Please use the \'new\' operator')){
      return true;
    }
    return false;
  }
}

const stringifyResult = (result) => {
  var language = 'javascript';
  if (typeof result == 'string'){
    result = stringify(result);
  } else if (typeof result == 'function'){
    if (isClass(result)){
      result = ('ƒ ' + result).replace('ƒ function ', 'ƒ class ');
    } else {
      result = 'ƒ ' + result;
    }
  } else if (typeof result == 'object'){
    if (isHTMLElement(result)){
      language = 'html';
      result = result.outerHTML;
    } else {
      if (result instanceof Promise){
        result = 'Promise {<pending>}';
      } else {
        result = JSON.stringify(result);
      }
    }
  }
  return {result: String(result), language: language || 'javascript'}
}

const isHTMLElement = (element) => {
  return element instanceof Node;
}

// `<pre><code class="language-css">p { color: red }</code></pre>`

function stringify(string){
  if (string.includes('\'') && string.includes('\"') && string.includes('\`')){
    return `\`${string.replaceAll('\`', '\\\`')}\``;
  } else if (string.includes('\'') && string.includes('\"')){
    return `\`${string}\``;
  } else if (string.includes('\'')){
    return `"${string}"`;
  } else if (string.includes('\"')){
    return `'${string}'`;
  } else if (string.includes('\`')){
    return `'${string}'`;
  }
  return `'${string}'`;
}

async function execute(){
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
    const executeCode = async (code) => {
      try {
        var result = eval(code);
      } catch (error) {
        console.error(String(error));
      }
      var sr;
      let response_div = document.createElement('div');
      response_div.classList.add('response');
      console.appendChild(response_div);
      console.appendChild(textarea_div);
      let response_pre = document.createElement('pre');
      let response_code = document.createElement('code');
      response_pre.appendChild(response_code);
      console.appendChild(response_pre);
      Prism.highlightElement(response_pre);
      response_div.appendChild(response_pre);
      if (result instanceof Promise) {
        response_code.innerText = result;
        sr = stringifyResult(result);
        response_pre.classList.add('language-' + sr.language);
        response_code.innerText = result;
        result = (await result);
        sr = stringifyResult(result);
        response_pre.classList.remove('language-' + sr.language);
        response_pre.classList.remove('language-none');
        response_pre.classList.add('language-' + sr.language);
      } else {
        sr = stringifyResult(result);
        response_pre.classList.remove('language-none');
        response_pre.classList.add('language-' + sr.language);
      }
      response_code.innerText = sr.result;
      Prism.highlightElement(response_pre);
    }
    // await result;
    executeCode(value);
  };
  execute_();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('span.version').innerText = version;
  window.original_console = console;
  window.console = document.getElementById('console');
  console.clear = () => {
    while (console.firstElementChild.id != 'input'){
      console.firstElementChild.remove();
    }
  }

  const log = (do_ = null, ...data) => {
    let pre = document.createElement('pre');
    pre.classList.add('nologo');
    pre.classList.add('signleline');
    if (do_) pre.classList.add(do_);
    if (data.length == 1){
      if (typeof data[0] == 'string'){
        pre.classList.add('language-none');
        pre.innerText = data[0];
      } else {
        var sr = stringifyResult(data[0]);
        pre.classList.add('language-' + sr.language);
        pre.innerText = sr.result;
        Prism.highlightElement(pre);
      }
    } else {
      for (var element of data){
        let pre_ = document.createElement('pre');
        if (typeof element == 'string'){
          pre_.classList.add('language-none');
          pre_.innerText = element;
        } else {
          var sr = stringifyResult(element);
          pre_.classList.add('language-' + sr.language);
          pre_.innerText = sr.result;
          Prism.highlightElement(pre_);
        }
        pre.appendChild(pre_);
      }
    }
    console.appendChild(pre);
    console.appendChild(textarea_div);
    original_console[do_](...data);
  }

  console.log = (...data) => log('log', ...data);
  console.warn = (...data) => log('warn', ...data);
  console.error = (...data) => log('error', ...data);
  
  window.textarea_div = document.getElementById('input');
  window.textarea = document.querySelector('#input textarea');
});

document.getElementById('fontSelection').addEventListener('change', (event) => {
  document.body.style.setProperty('--console-font', event.target.value);
});

document.querySelector('#fontSize').addEventListener('change', (event) => {
  document.body.style.setProperty('--console-font-size', event.target.value + 'px');
});

function showSettings(){
  document.getElementById('settings').classList.add('visible');
}

function hideSettings(){
  document.getElementById('settings').classList.remove('visible');
}