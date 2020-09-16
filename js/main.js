$(function () {
    $('#search_books').click(function () {
        var bookNames = $('#book_names').val().split(',');
        var ISBNs = bookNamesToISBNs(bookNames);
        var librarys = searchLibrarysByISBNs(ISBNs);
        console.log(librarys);
    });
});
