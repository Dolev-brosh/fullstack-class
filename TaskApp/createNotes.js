function createNote() {
    const noteContent = `
    <button class="sys-button note-btn star-btn" aria-label="Delete note" data-action="star">
        <i class="ph ph-star star-icon"></i>
    </button>
    <textarea class="note-body-input" name="task" placeholder="Add your task here"></textarea>
    <div class="date-actions-wrapper" style="display:none;">
        <input  class="date-time-input" name="date&time" type="text" placeholder="Choose date&time">
            <div class="buttons-wrapper">
                <button class="sys-button note-btn delete-btn" aria-label="Delete note" data-action="delete">
                    <i class="ph ph-x"></i>
                </button>
                <button class="sys-button note-btn save-btn" data-action="save" aria-label="Save note">
                    <i class="ph ph-floppy-disk"></i>
                </button>
            </div>
    </div>
    <p class="note-hint">Done? Hit Enter to schedule</p>
    `
    const note = document.createElement('div');
    note.className = 'note';
    note.innerHTML = noteContent;

    return note;
};

function setupNoteLogic(noteElement){
    let state = 'initial';

    const textarea = noteElement.querySelector('.note-body-input');
    const dateAndTime = noteElement.querySelector('.date-time-input');
    const dateTimeWrapper = noteElement.querySelector('.date-actions-wrapper');
    const hint = noteElement.querySelector('.note-hint');

    const saveButton = noteElement.querySelector('.save-btn');
    const deleteButton = noteElement.querySelector('.delete-btn');
    const starButton = noteElement.querySelector('.star-btn');
    const saveIcon = saveButton.querySelector('i');
    const deleteIcon = deleteButton.querySelector('i'); 
    const starIcon = starButton.querySelector('i');

    textarea.addEventListener("keydown", (e) => {
        if(e.key === 'Enter' && !e.shiftKey && state === 'initial' && textarea.value.trim() !== ''){
            e.preventDefault();
            state = 'edit-date';
            renderState();   
        }
    })

    starButton.addEventListener('click', () => {
            starIcon.classList.toggle('ph-fill');
            starButton.classList.toggle('favorite');
            if (starIcon.classList.contains('ph-fill')) {
                triggerFloatingStars(starButton, 10);
        }
    })


    function triggerFloatingStars(container, count = 10){
        for (let i = 0; i < count; i++){
            const star = document.createElement('i');
            star.classList.add('ph-fill', 'ph-star', 'floating-star');

            const size = Math.random() * 2.4 + 0.8;
            const xOffset = (Math.random() * 80 + 'px');
            const delay = Math.random() * 300;

            const colors = ['#FEC971', '#FE9B72', '#00D4FE', '#E4EF8F', '#B693FD'];
            
            star.style.color = colors[Math.floor(Math.random()* colors.length)]
            star.style.fontSize = `${size}rem`;
            star.style.opacity = Math.random();
            star.style.left = '50%';
            star.style.top = '50%';
            star.style.transform = 'translate(-50%, -30%)';
            star.style.setProperty('--x', xOffset);
            star.style.animationDelay = `${delay}ms`;

            container.appendChild(star);

            

            setTimeout( () => {
                star.remove();

            }, 1000);

        }
    }

    saveButton.addEventListener('click', () => {
        const action =saveButton.dataset.action;

        if(action === 'save'){
            state = 'read-only';
            saveButton.dataset.action = 'edit';
            saveButton.setAttribute('aria-label', 'Edit note');
            renderState();
        } else if (action === 'edit'){
            state ='edit-date';
            saveButton.dataset.action = 'save';
            saveButton.setAttribute('aria-label', 'Save note');
            renderState();
        }
    })

    deleteButton.addEventListener('click', () => {
        const action = deleteButton.dataset.action;
        const id = noteElement.dataset.id;

        if(action === 'delete'){
            noteElement.remove();
            deleteNote(Number(id));
        } else if (action === 'reset'){
            textarea.value = '';
            noteElement.querySelector('.date-time-input').value = '';
            state = 'edit-date';
            saveButton.dataset.action = 'save';
            saveButton.setAttribute('aria-label', 'Save note');
            renderState();
        }
    })

    function renderState(){
        if(state === 'initial'){
            dateTimeWrapper.style.display = 'none';
            hint.style.display = 'block';
            textarea.focus();
            textarea.removeAttribute('readonly');
            deleteButton.dataset.action = 'delete';
            deleteButton.setAttribute('aria-label', 'Delete note');
        }

        if(state === 'edit-date'){
            dateTimeWrapper.style.display = 'flex';
            hint.style.display = 'none';
            textarea.focus();
            dateAndTime.disabled = false;
            textarea.removeAttribute('readonly');
            deleteButton.dataset.action = 'delete';
            deleteButton.setAttribute('aria-label', 'Delete note');
            deleteIcon.classList.replace('ph-arrow-clockwise', 'ph-x');
            saveIcon.classList.replace('ph-pencil-simple', 'ph-floppy-disk');
        }

        if(state === 'read-only'){
            dateTimeWrapper.style.display = 'flex';
            hint.style.display = 'none';
            textarea.setAttribute('readonly', true);
            dateAndTime.disabled = true;
            deleteButton.dataset.action = 'reset';
            deleteButton.setAttribute('aria-label', 'Reset note');
            deleteIcon.classList.replace('ph-x', 'ph-arrow-clockwise');
            saveIcon.classList.replace('ph-floppy-disk', 'ph-pencil-simple');
        }
    }

    flatpickr(dateAndTime, {
    enableTime: true,
    dateFormat: "d/m/y H:i",
    time_24hr: true,    
    });

    renderState();
}

