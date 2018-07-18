String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

const FAVICON_LINK = 'https://s2.googleusercontent.com/s2/favicons?domain_url=';

// build a sequence of links
function build_bookmarks(bookmarks, title) {
    let element = document.createDocumentFragment();

    if (title) {
        let h3 = document.createElement('h3');
        h3.textContent = title;
        element.appendChild(h3);
    }

    for (let bookmark of bookmarks) {
        element.appendChild(build_box_link(bookmark));
    }

    return build_blur_section_around(element, ["section-grid", "shadow"]);
};

// example:
// <a class="remove-style" href="https://www.facebook.com">
//     <div class="box-link">
//         <img src="https://s2.googleusercontent.com/s2/favicons?domain_url=www.facebook.com">
//         <div>Facebook</div>
//     </div>
// </a>
function build_box_link(bookmark) {
    let link = document.createElement('a');
    link.href = bookmark.url;
    link.className = "remove-style";

    let box = document.createElement('div');
    box.className = "box-link";

    let favicon = document.createElement('img');
    favicon.src = FAVICON_LINK + bookmark.url;

    let name = document.createElement('div');
    name.textContent = bookmark.title;

    link.appendChild(box);
    box.appendChild(favicon);
    box.appendChild(name);
    return link;
};




// Example blur section: build_blur_section_around(fragment, ["section-grid", "shadow"])
// <div class="section section-grid shadow">
//     <div class="blur">
//         <div class="blur-background"></div>
//         <div class="blur-color light"></div>
//
//         <div class="blur-content">
//             {{ fragment }}
//         </div>
//     </div>
// </div>
function build_blur_section_around(fragment, classes) {
    let section = document.createElement('div');
    classes.unshift("section");
    section.className = classes.join(" ");

    let blur = document.createElement('div');
    blur.className = "blur";

    let blur_bg = document.createElement('div');
    blur_bg.className = "blur-background";

    let blur_col = document.createElement('div');
    blur_col.className = "blur-color light";

    let blur_content = document.createElement('div');
    blur_content.className = "blur-content";
    blur_content.appendChild(fragment);

    section.appendChild(blur);
    blur.appendChild(blur_bg);
    blur.appendChild(blur_col);
    blur.appendChild(blur_content);

    return section;
};

function add_attr(element, attr, value = null) {
    let at = document.createAttribute(attr);
    if (value) at.value = value;
    element.setAttributeNode(at);
};
