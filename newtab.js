window.addEventListener('DOMContentLoaded', function() {
    const FAVICON_LINK = 'https://s2.googleusercontent.com/s2/favicons?domain_url=';

    function add_attr(element, attr, value = null) {
        let at = document.createAttribute(attr);
        if (value) at.value = value;
        element.setAttributeNode(at);
    };

    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };

    function build_bookmarks(bookmarks) {
        let element = document.createDocumentFragment();
        for (let bookmark of bookmarks) {
            console.log(bookmark);
            element.appendChild(build_link(bookmark));
        }
        return element;
    }

    function build_link(bookmark) {
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
    }

    let is_focus = false;

    document.addEventListener('mousedown', function() {
        let search = document.getElementById('search');
        is_focus = search === document.activeElement
    }, false);

    document.addEventListener('click', function() {
        if (!is_focus) {
            document.getElementById('search').focus();
        }
    });

    let unprocessed = [];
    let bookmarks = [];
    let folders = [];
    browser.bookmarks.getTree(function(result) {
        console.log(result[0].children[1].children);
        for (let node of result) unprocessed.push(node);
        while (unprocessed.length > 0) {
            process_node(unprocessed.shift());
        }
        document.getElementById("here").appendChild(build_bookmarks(bookmarks));
    });

    function process_node(node) {
        if (node.type === 'bookmark') {
            bookmarks.push(node);
        } else if (node.type === 'folder') {
            folders.push(node);
            process_folder(node);
        }
    }

    function process_folder(folder) {
        for (let child of folder.children.reverse()) {
            unprocessed.push(child);
        }
    }


});
