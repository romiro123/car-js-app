const multiSelect = () => {
    const elements = document.querySelectorAll('.multi-select');
    elements.forEach(el => {
        const choices = new Choices(el, {
            allowHTML: true,
            searchEnabled: false,
            itemSelectText: '',
        });
    });
}
//multiSelect();