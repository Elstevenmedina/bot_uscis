const d = document,
$button = d.getElementsByTagName('button');

d.addEventListener('submit', e =>{
    for(i=0; i< $button.length; i++){
        if($button[i].getAttribute('type') == 'submit'){
            $button[i].setAttribute('disabled','')
        }
    }
})