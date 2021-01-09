
console.log("просто");

$( document ).ready(function() {
   console.log("до slick");
   $('.slider-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav'
   });
   $('.slider-nav').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: '.slider-for',
      infinite: true,
      dots: false,
      arrows: false,
      centerMode: true,
      focusOnSelect: true
   });
   
   // popap
   $('[data-fancybox]').fancybox({
      // Options will go here
   });

   $(".hamburger").click(function() {
      $(this).toggleClass("is-active");
      $('body').toggleClass("openMenu");
   })

});


