/*
        _                   _____           _       _
       | |                 / ____|         (_)     | |
       | | __ ___   ____ _| (___   ___ _ __ _ _ __ | |_
   _   | |/ _` \ \ / / _` |\___ \ / __| '__| | '_ \| __|
  | |__| | (_| |\ V / (_| |____) | (__| |  | | |_) | |_
   \____/ \__,_| \_/ \__,_|_____/ \___|_|  |_| .__/ \__|
  | |  | |          | |       | | | |        | |
  | |__| | __ _  ___| | ____ _| |_| |__   ___|_| __
  |  __  |/ _` |/ __| |/ / _` | __| '_ \ / _ \| '_ \
  | |  | | (_| | (__|   < (_| | |_| | | | (_) | | | |
  |_|  |_|\__,_|\___|_|\_\__,_|\__|_| |_|\___/|_| |_|

*/

let blogData;
let aboutMeData;
let polaroidData;

document.addEventListener('DOMContentLoaded', async (event) => {
    view = getUrlParameter('view');
    selectView(view);
});

function copyCodeToClipboard() {
    let code = document.getElementById("refLinkCopy").value;
    navigator.clipboard.writeText(code);
}

function nextPage(e, selected_page) {
    let page;
    let view = getUrlParameter('view');

    if (!isNaN(selected_page)) {
        page = selected_page;
    } else {
        page = getUrlParameter('page');
    }

    page = parseInt(page) || 0;

    switch (e.id) {
        case "bookRightArrow":
            setUrlParameter('page', page + 1)
            break;
        case "bookLeftArrow":
            setUrlParameter('page', page - 1)
            break;
        default:
            break;
    }

    selectView(view);
}

async function loadJsonFile(filePath) {
    try {
        let response = await fetch(filePath);
        let json = await response.json();
        console.log('JSON file loaded:', json);
        return json;
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

function setUrlParameter(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

function getUrlParameter(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}

function rotateSticker() {
    const sticker = document.querySelectorAll(".sticker, .polaroid");
    Array.from(sticker).forEach(element => {
        const randomRotation = Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees
        element.style.transform = `rotate(${randomRotation}deg)`;
    });
}

async function selectView(view) {
    switch (view) {
        case 'polaroid':
            setUrlParameter('view', 'polaroid');
            polaroidData = await loadJsonFile('data/polaroid.json');
            displayPolaroid();
            break;
        case 'links':
            setUrlParameter('view', 'links');
            linkData = await loadJsonFile('data/links.json');
            displayLinks();
            break;
        case 'about':
            setUrlParameter('view', 'about');
            aboutMeData = await loadJsonFile('data/about_me.json');
            displayAboutMe();
            break;
        default:
            setUrlParameter('view', 'blog');
            blogData = await loadJsonFile('data/blog.json');
            displayBlog();
            break;
    }
}

function displayPolaroid() {
    let page = parseInt(getUrlParameter('page'))

    if (isNaN(page) || page < 0) {
        page = 0;
    }

    const maxPage = polaroidData.length - 1;

    if (page > maxPage) {
        page = maxPage;
    }

    const leftPageElement = document.getElementById('bookLeftPage');
    const leftTitleElement = leftPageElement.getElementsByClassName('bookTitle')[0];
    const leftTextElement = leftPageElement.getElementsByClassName('bookText')[0];
    const leftArrowElement = leftPageElement.getElementsByClassName('bookArrow')[0];

    const rightPageElement = document.getElementById('bookRightPage');
    const rightTextElement = rightPageElement.getElementsByClassName('bookText')[0];
    const rightArrowElement = rightPageElement.getElementsByClassName('bookArrow')[0];

    if (polaroidData[page]) {
        leftTitleElement.innerHTML = polaroidData[page]['title'];
        leftTextElement.innerHTML = `<img class="polaroid" src="${polaroidData[page]['image']}">`;
        rightTextElement.innerHTML = polaroidData[page]['description'];
    } else {
        leftTitleElement.innerHTML = "";
        leftTextElement.innerHTML = "";
        rightTextElement.innerHTML = "";
    }

    leftArrowElement.style.display = (page <= 0) ? 'none' : 'block';
    rightArrowElement.style.display = (!polaroidData[page + 1]) ? 'none' : 'block';

    rotateSticker();
}

function displayLinks() {
    const leftPageElement = document.getElementById('bookLeftPage');
    const rightPageElement = document.getElementById('bookRightPage');

    const leftTitleElement = leftPageElement.getElementsByClassName('bookTitle')[0];
    const leftTextElement = leftPageElement.getElementsByClassName('bookText')[0];
    const leftArrowElement = leftPageElement.getElementsByClassName('bookArrow')[0];

    const rightTextElement = rightPageElement.getElementsByClassName('bookText')[0];
    const rightArrowElement = rightPageElement.getElementsByClassName('bookArrow')[0];

    let linkWall = "";

    linkData.forEach(link => {
        linkWall += `<a href="${link.url}" target="_blank"><img class="button" src="${link.image}"/></a>`;
    });

    linkWall += "</p><h2>Link me with my button!</2</p><img class=\"sticker\" src=\"assets/button.gif\"><input id=\"refLinkCopy\" value='<a href=\"https://google.de\"><img src=\"assets/button.gif\"></a>' readonly><button onclick=\"copyCodeToClipboard()\">Copy code</button>";

    leftTitleElement.innerHTML = "Links";
    leftTextElement.innerHTML = linkWall;
    rightTextElement.innerHTML = "";

    leftArrowElement.style.display = 'none';
    rightArrowElement.style.display = 'none';
}

function displayAboutMe() {
    const leftPageElement = document.getElementById('bookLeftPage');
    const rightPageElement = document.getElementById('bookRightPage');

    const leftTitleElement = leftPageElement.getElementsByClassName('bookTitle')[0];
    const leftTextElement = leftPageElement.getElementsByClassName('bookText')[0];
    const leftArrowElement = leftPageElement.getElementsByClassName('bookArrow')[0];

    const rightTextElement = rightPageElement.getElementsByClassName('bookText')[0];
    const rightArrowElement = rightPageElement.getElementsByClassName('bookArrow')[0];

    leftTitleElement.innerHTML = aboutMeData['title'];
    leftTextElement.innerHTML = aboutMeData['content_left'];
    rightTextElement.innerHTML = aboutMeData['content_right'];

    leftArrowElement.style.display = 'none';
    rightArrowElement.style.display = 'none';
}

function displayBlog() {
    let page = parseInt(getUrlParameter('page'))

    if (isNaN(page) || page < 0) {
        page = 0;
    }

    const maxPage = blogData.length - 1;

    if (page > maxPage) {
        page = maxPage;
    }

    const leftPageElement = document.getElementById('bookLeftPage');
    const leftTitleElement = leftPageElement.getElementsByClassName('bookTitle')[0];
    const leftTextElement = leftPageElement.getElementsByClassName('bookText')[0];
    const leftArrowElement = leftPageElement.getElementsByClassName('bookArrow')[0];

    const rightPageElement = document.getElementById('bookRightPage');
    const rightTextElement = rightPageElement.getElementsByClassName('bookText')[0];
    const rightArrowElement = rightPageElement.getElementsByClassName('bookArrow')[0];

    if (blogData[page]) {
        leftTitleElement.innerHTML = blogData[page]['title'];
        leftTextElement.innerHTML = blogData[page]['content_left'];
        rightTextElement.innerHTML = blogData[page]['content_right'];
    } else {
        leftTitleElement.innerHTML = "";
        leftTextElement.innerHTML = "";
        rightTextElement.innerHTML = "";
    }

    leftArrowElement.style.display = (page <= 0) ? 'none' : 'block';
    rightArrowElement.style.display = (!blogData[page + 1]) ? 'none' : 'block';

    rotateSticker();
}