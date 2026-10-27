/* ————————————————————————————————————————————————————————————
   SENIXR — interactions (vanilla JS rebuild)
   · scroll reveal (IntersectionObserver)
   · mouse spotlight + custom cursor accents (desktop only)
   · copy-to-clipboard with fallback + check swap + toast
   ———————————————————————————————————————————————————————————— */

(function () {
  "use strict";

  /* ————— scroll reveal ————— */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ————— mouse spotlight + custom cursor accents ————— */
  function initCursor() {
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    var fine = window.matchMedia("(pointer: fine)").matches;

    var onMove = function (e) {
      document.documentElement.style.setProperty("--mx", e.clientX + "px");
      document.documentElement.style.setProperty("--my", e.clientY + "px");
      if (fine) {
        if (dot) {
          dot.style.transform =
            "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%)";
        }
        if (ring) {
          ring.style.transform =
            "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%)";
        }
      }
    };

    var onOver = function (e) {
      if (!ring) return;
      var target = e.target;
      var interactive =
        target instanceof Element &&
        target.closest('a, button, [role="button"]');
      ring.classList.toggle("cursor-ring-active", !!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
  }

  /* ————— toast ————— */
  function showToast(description, duration) {
    var viewport = document.getElementById("toast-viewport");
    if (!viewport) return;

    var toast = document.createElement("div");
    toast.className = "toast";

    var desc = document.createElement("div");
    desc.className = "toast-description";
    desc.textContent = description;
    toast.appendChild(desc);

    viewport.appendChild(toast);

    // force reflow so the entrance transition runs
    void toast.offsetWidth;
    toast.classList.add("is-shown");

    window.setTimeout(function () {
      toast.classList.add("is-leaving");
      window.setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  /* ————— copy to clipboard (with fallback) ————— */
  function copyToClipboard(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /* ————— copy buttons ————— */
  function initCopyButtons() {
    var copyTimer = null;
    var buttons = document.querySelectorAll(".copy-btn[data-copy]");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-copy");
        var label = btn.getAttribute("data-label") || "value";

        copyToClipboard(value).catch(function () {
          /* clipboard unavailable — still give visual feedback */
        });

        document.querySelectorAll(".copy-btn.is-copied").forEach(function (b) {
          b.classList.remove("is-copied");
        });
        btn.classList.add("is-copied");

        if (copyTimer) window.clearTimeout(copyTimer);
        copyTimer = window.setTimeout(function () {
          document.querySelectorAll(".copy-btn.is-copied").forEach(function (b) {
            b.classList.remove("is-copied");
          });
        }, 2000);

        showToast(label + " copied — " + value, 2000);
      });
    });
  }

  /* ————— boot ————— */
  function init() {
    initReveal();
    initCursor();
    initCopyButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
