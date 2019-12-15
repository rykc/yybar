export default function(elem, param) {
  param = param || {};

  const initValue = {
    progressTextColor: "#ffff00",
    foreBarColor: "#888888",
    backBarColor: "#000000",
    descColor: "#ffffff",
    progressText: "Reading progress...",
    desc: "",
    fontFamily: "Arial",
    fontSize: "13px",
    height: "30px",
    position: "top",
    autoHide: false
  };

  let selfElem = document.getElementById(elem) || null;

  if (selfElem) {

    selfElem.innerHTML = '\
      <div class="yybar-fore-bar"></div>\
      <div class="yybar-progress-text" style="z-index:2;"></div>\
      <div class="yybar-progress-text-value"></div>\
      <div class="yybar-desc"></div>\
    ';
    selfElem.style.position = 'fixed';
    selfElem.style.left = '0px';
    selfElem.style.width = '100%';
    selfElem.style.cursor = 'pointer';
    selfElem.style['-webkit-touch-callout'] = 'none'; /* iOS Safari */
    selfElem.style['-webkit-user-select'] = 'none'; /* Safari */
    selfElem.style['-khtml-user-select'] = 'none'; /* Konqueror HTML */
    selfElem.style['-moz-user-select'] = 'none'; /* Old versions of Firefox */
    selfElem.style['-ms-user-select'] = 'none'; /* Internet Explorer/Edge */
    selfElem.style['user-select'] = 'none';
    selfElem.style.backgroundColor = param.backBarColor || initValue.backBarColor;
    selfElem.style.color = param.progressTextColor || initValue.progressTextColor;
    selfElem.style.fontFamily = initValue.fontFamily;
    selfElem.style.fontSize = initValue.fontSize;
    selfElem.style.height =
      (typeof param.height === "number" ? param.height + "px" : param.height) ||
      initValue.height;
    selfElem.style[(param.position || initValue.position) == "top" ? 'top' : 'bottom'] = 0;

    const foreBar = selfElem.getElementsByClassName("yybar-fore-bar")[0];
    foreBar.style.backgroundColor = param.foreBarColor || initValue.foreBarColor;
    foreBar.style.zIndex = 1;
    foreBar.style.position = 'absolute';
    foreBar.style.bottom = 0;
    foreBar.style.left = 0;
    foreBar.style.height = '100%';

    const progressText = selfElem.getElementsByClassName("yybar-progress-text")[0];
    progressText.style.position = 'relative';
    progressText.style.zIndex = 2;
    progressText.style.display = 'inline-block';
    progressText.style.top = '3px';
    progressText.style.left = '5px';
    progressText.innerHTML = param.progressText || initValue.progressText;

    const progressTextValue = selfElem.getElementsByClassName("yybar-progress-text-value")[0];
    progressTextValue.style.position = 'relative';
    progressTextValue.style.zIndex = 2;
    progressTextValue.style.display = 'inline-block';
    progressTextValue.style.top = '3px';
    progressTextValue.style.left = '5px';

    const desc = selfElem.getElementsByClassName("yybar-desc")[0];
    desc.style.position = 'absolute';
    desc.style.zIndex = 2;
    desc.style.display = 'inline-block';
    desc.style.top = '20px';
    desc.style.left = '5px';    
    desc.style.color = param.descColor || initValue.descColor;
    desc.innerHTML = param.desc || initValue.desc;

    let scrollPosition = {};
    scrollPosition.lastScrollTop = 0;

    function getScrollPercent() {
      var h = getTarget(),
          b = document.body,
          st = "scrollTop",
          sh = "scrollHeight";
      return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
    }

    function getTarget(isWindow=false){
      const target = param.target || null;
      if(target){
        const targetElem = document.getElementById(target);
        if(targetElem){
          return targetElem;
        } else{
          console.error("target DOM elemnet is not defined.");
          return isWindow ? window : document.documentElement;
        }
      }
      return isWindow ? window : document.documentElement;
    }

    function scrollHandler() {
      (function(scrollPosition) {
        foreBar.style.width = getScrollPercent() + "%";
        progressTextValue.innerHTML = Math.round(getScrollPercent()) + "%";

        if (param.autoHide) {
          var st = getTarget().pageYOffset || document.documentElement.scrollTop;
          selfElem.style.visibility =
            st > scrollPosition.lastScrollTop ? "visible" : "hidden";
          scrollPosition.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }
      })(scrollPosition);
    }

    function bindScrollEvent({ event, elem }) {
      elem.addEventListener("scroll", scrollHandler);
      event.removeScroll = function() {
        elem.removeEventListener("scroll", scrollHandler);
        dispose();
      };
    }

    selfElem.addEventListener("click", function(e) {
      const documentElement = getTarget();
      const value =
        (e.clientX / selfElem.clientWidth) *
        (documentElement.scrollHeight -
          documentElement.clientHeight);
      getTarget(true).scrollTo(0, value);
    });

    function mouseMoveFunction(e) {
      const documentElement = getTarget();
      const value =
        (e.clientX / selfElem.clientWidth) *
        (documentElement.scrollHeight -
          documentElement.clientHeight);
      getTarget(true).scrollTo(0, value);
    }

    selfElem.addEventListener("mousedown", function(e) {
      this.addEventListener("mousemove", mouseMoveFunction);
    });

    selfElem.addEventListener("mouseup", function(e) {
      this.removeEventListener("mousemove", mouseMoveFunction);
    });

    if ("ontouchmove" in window) {
      selfElem.ontouchmove = function(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        const documentElement = getTarget();
        const value =
          (touches[0].clientX / selfElem.clientWidth) *
          (documentElement.scrollHeight -
            documentElement.clientHeight);
        getTarget(true).scrollTo(0, value);
      };
    }

    function dispose() {
      selfElem.innerHTML = "";
      selfElem.removeAttribute("style");
    }

    function docReady(fn) {
      if (document.readyState === "complete" || document.readyState === "interactive") {
          setTimeout(fn, 1);
      } else {
          document.addEventListener("DOMContentLoaded", fn);
      }
    }  

    let event = {};
    docReady(function() {
      bindScrollEvent({ elem: getTarget(true), event });
    });
    

  } else {
    console.error("yybar DOM element is not defined.");
  }

  return {
    dispose: function() {
      event.removeScroll();
    }
  };
}
