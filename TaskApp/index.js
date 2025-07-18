const addNoteBtn = document.getElementById('add-note-btn');
const noteMenu = document.getElementById('note-menu');
const noteBtn = document.querySelectorAll('.color-btn');
const notesContainer = document.getElementById('notes-area');
const buttons = document.querySelectorAll('.group-btn');
const slider = document.querySelector('.slider');
const allButton = document.querySelector('.all');
const favoriteButton = document.querySelector('.favorite');
const searchInput = document.getElementById('search-input');

addNoteBtn.addEventListener("click", ()=> {
    noteMenu.classList.toggle("show");
})

let currentLogoColor = '#FE9B72';

function  updateSvgPathsColor(newColor){
    const svg = document.getElementById('logo');
    if(!svg) return;
    const paths = svg.querySelectorAll('path');

    paths.forEach(path => {
        if(path.getAttribute('fill') === currentLogoColor){
            path.setAttribute('fill', `var(--${newColor})`);
        }    
    })

    currentLogoColor = `var(--${newColor})`;
}

noteMenu.addEventListener('click', (e) => {
    const target = e.target;

    if(target.classList.contains('color-btn')){
        const colorClass = target.id;
        
        updateSvgPathsColor(colorClass);
        addNotes('', '', colorClass);
    }
});

function updateIndicator(activeBtn){
    const btnRect = activeBtn.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();

    const left = btnRect.left -sliderRect.left;
    const width = btnRect.width;

    slider.style.setProperty('--before-left', `${left}px`);
    slider.style.setProperty('--before-width', `${width}px`);

    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => updateIndicator(btn));
})

updateIndicator(document.querySelector('.group-btn.active'));

favoriteButton.addEventListener('click', () => {
    const allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note => {
        const starButton = note.querySelector('.star-btn');

        if(!starButton.classList.contains('favorite')){
            note.style.display = 'none';
        } else {
            note.style.display = '';
        }
    });
})

allButton.addEventListener('click', () => {
    const allNotes = document.querySelectorAll('.note');

    allNotes.forEach(note => {
        
        note.style.display = '';

    });
})

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const notes = document.querySelectorAll('.note');

    notes.forEach(note => {
        const text = note.querySelector('.note-body-input').value.toLowerCase();
        note.style.display = text.includes(query) ? '' : 'none';
    })
})

function saveNoteToLocalStorage(noteArray){
    localStorage.setItem('notes', JSON.stringify(noteArray));
}

function loadNotesFromLocalStorage(){
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function addNotes(text, dateTime, color){
    const notes = loadNotesFromLocalStorage();

    const newNote = {
        id: Date.now(),
        text, 
        dateTime,
        color
    };

    notes.push(newNote);
    saveNoteToLocalStorage(notes);

    const noteElement = createNoteFromData(newNote);
    notesContainer.prepend(noteElement);
}

function deleteNote(id){
    let notes = loadNotesFromLocalStorage();
    notes = notes.filter(note => note.id !== id);
    saveNoteToLocalStorage(notes);
}

window.addEventListener('DOMContentLoaded', () => {
    const notes = loadNotesFromLocalStorage();
    notes.forEach(note => {
        const noteElement = createNoteFromData(note);
        notesContainer.prepend(noteElement);
    })
})

function createNoteFromData({id, text, dateTime, color}){
    const note = createNote();
    const textarea = note.querySelector('.note-body-input');
    const dateInput = note.querySelector('.date-time-input');

    note.dataset.id = id;
    textarea.value = text;
    dateInput.value = dateTime;
    note.style.background = `var(--${color})`;

    setupNoteLogic(note, id);
    return note;
}

function deleteAllNotes() {
    localStorage.removeItem('notes');

    notesContainer.innerHTML = '';
}

const deleteAllBtn = document.getElementById('delete-all-btn');

deleteAllBtn.addEventListener('click', () => {
    deleteAllNotes();
    
});

