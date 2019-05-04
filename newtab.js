import Search from './js/Search.js';
import TopSites from './js/TopSites.js';
import Clock from './js/Clock.js';
import Weather from './js/Weather.js';
import Bar from './js/Bar.js';

const HOMELY_FOLDER = 'Homely';
const SOCIAL_FOLDER = 'Social Media';
const VIDEO_FOLDER = 'Video';
const MUSIC_FOLDER = 'Music';

const loadContent = async () => {

    const search = new Search();
    const clock = new Clock();
    clock.start();
    const topSites = new TopSites();
    const weather = new Weather();
    const bar = new Bar();

    await Promise.all([
        search.initialised,
        topSites.initialised,
        weather.initialised,
        bar.initialised,
    ]);

    topSites.render();

    // const bookmarks_api = browser.bookmarks;

    // let is_focus = false;

    // document.addEventListener('mousedown', function() {
    //     let search = document.getElementById('search');
    //     is_focus = search === document.activeElement
    // }, false);

    // document.addEventListener('click', function() {
    //     if (!is_focus) {
    //         document.getElementById('search').focus();
    //     }
    // });

    // function on_rejected(error) {
    //     console.log(`An error: ${error}`);
    // }

    // function init_folders() {
    //     bookmarks_api.create({
    //         title: HOMELY_FOLDER,
    //         type: 'folder'
    //     }).then(function(node) {

    //         let creating_folders = [
    //             bookmarks_api.create({
    //                 title: SOCIAL_FOLDER,
    //                 type: 'folder',
    //                 parentId: node.id
    //             }),
    //             bookmarks_api.create({
    //                 title: VIDEO_FOLDER,
    //                 type: 'folder',
    //                 parentId: node.id
    //             }),
    //             bookmarks_api.create({
    //                 title: MUSIC_FOLDER,
    //                 type: 'folder',
    //                 parentId: node.id
    //             })
    //         ];

    //         Promise.all(creating_folders).then(populate_folders, on_rejected);
    //     }, on_rejected);
    // }

    // function populate_folders(folders) {

    //     display_folder(folders[0].parentId);
    // }

    // function display_folder(id) {
    //     bookmarks_api.getSubTree(id).then(process_subtree, on_rejected);
    // }


    // let unprocessed = [];
    // let bookmarks = [];
    // let folders = [];
    // bookmarks_api.search({
    //     title: HOMELY_FOLDER
    // }).then(
    //     bookmark_items => {
    //         let folder = null;
    //         for (let bookmark of bookmark_items) {
    //             if (bookmark.type === 'folder') {
    //                 folder = bookmark;
    //                 break;
    //             }
    //         }
    //         if (folder) {
    //             display_folder(folder.id);
    //         } else {
    //             init_folders();
    //         }
    //     }, on_rejected);

    // function process_subtree(bookmark_items) {
    //     // if (bookmark_items.length == 0) return init_folders();

    //     for (let bookmark of bookmark_items[0].children) {
    //         console.log(bookmark.children);
    //         if (bookmark.type === 'folder') {
    //             console.log(build_bookmarks(bookmark.children, bookmark.title));
    //             document.getElementById("bookmarks").appendChild(build_bookmarks(bookmark.children, bookmark.title));
    //         }
    //     }
    // }
};

window.addEventListener('DOMContentLoaded', () => {
    loadContent();
});
