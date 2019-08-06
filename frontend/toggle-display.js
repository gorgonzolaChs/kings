
var pages = ['main-page', 'pass-page', 'lobby-page', 'game-page'];

function changePage(targetPage){

    if(targetPage === 'main-page'){

        document.getElementById('display-name').value= '';
        document.getElementById('password-input').value= '';

    }

    if(!targetPage) 

        targetPage = 'main-page';

    for(var i = 0; i < pages.length; i++){

        if(pages[i] === targetPage) 

            document.getElementById(pages[i]).style.display = 'block';

        else 
        
            document.getElementById(pages[i]).style.display = 'none';

    }

}