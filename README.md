# scroller #

Basically this started as a prove of concept, but after I wrote this, it got used in some projects right away.
So, if you want, you can use this project in your projects as well, just do it. If you encounter some wild
magikarp or so, just leave me a ticket.

The scrollbars itself don't have any style because I don't know what most people need. So if you want to style
the scrollbar, see the *index.html*. In the style tag there you'll see the best way to style the scrollbars.

## Basic API ##

In the *dist/* folder you'll find a build version, which is usually up to date. You can use this bundle in your own
system, reuse the sourcecode itself. The bundle is wrapped as UMD module, so you can use it whereever you want. If
you don't use a module loader, it will expose it's module API as `global.scroller`.

The bundle exposes this interface:

    {
        ScrollContainer: Constructor(HTMLElement, OptionsObject = {})
        VERSION: String
    }
    
The version will tell you about your used version, but this is not important for the helper itself I guess. The other
option here is the *ScrollContainer* class, which is basicly the whole helper.

You can use it like:

    scroller.ScrollContainer(document.getElementById('myScrollContainer'), {});

and that's it. After this the container is set up and can be used.

## Available options ##

There are some options, you can use:

* `disableTouchScrollingOnContainer<Boolean>`: This option tells the container, not to add event listeners for touch
scrolling to the container, otherwise touch users can put their finger anywhere in the container and scroll with this
like they are used to. Default: false
* `checkInterval<Number>`: This option will tell, in what interval the container should be checked. The interval will
check the size of the container itself, and whether the container is in the DOM tree or not. If the container is not
in the DOM tree anymore, the destroy method is invoked automatically. The count of this is in ms. Default: 300
* `disableXScrolling<Boolean>`: Whether to disable scrolling in x directory. Default: false
* `disableYScrolling<Boolean>`: Whether to disable scrolling in y directory. Default: false
* `xElementStyles<Object>`: An object which contains styles, that should get applied to the x scroll element. This
overwrites the default style. Default: {}
* `yElementStyles<Object>`: An object which contains styles, that should get applied to the y scroll element. This
overwrites the default style. Default: {}
* `xElementClass<Array[string]|sring>`: A class or classlist, that gets applied to the x scroll element. Default: []
* `yElementClass<Array[string]|sring>`: A class or classlist, that gets applied to the y scroll element. Default: []

## Changelog ##

### Version 1.0.0 ###

* Initial release