module nurdz
{
    /**
     * This type interface is used to make the contentLoaded function below operate as expected. In order
     * to be cross platform it tries to use some sort of stupid IE only method (which no longer works as
     * of IE 11).
     *
     * In order to make that code compile, we create a new interface that is a sub-interface of the normal
     * HTMLElement and indicate that such a method exists, and then use a typecast in the function to make
     * everything kosher.
     */
    interface BrokenIEHTMLElement extends HTMLElement
    {
        doScroll (string);
    }

    /**
     * In a browser non-specific way, watch to determine when the DOM is fully loaded and then invoke
     * the function that is provided.
     *
     * This code was written by Diego Perini (diego.perini at gmail.com) and was taken from the
     * following URL:
     *     http://javascript.nwbox.com/ContentLoaded/
     *
     * @param win reference to the browser window object
     * @param fn the function to invoke when the DOM is ready.
     */

    export function contentLoaded (win : Window, fn : Function)
    {
        var done = false, top = true,

            // The typecast below was added for TypeScript compatibility because HTMLElement doesn't include
            // the doScroll() method used below when the browser is IE.
            doc = win.document,
            root = <BrokenIEHTMLElement>doc.documentElement,
            modern = doc.addEventListener,

            add = modern ? 'addEventListener' : 'attachEvent',
            rem = modern ? 'removeEventListener' : 'detachEvent',
            pre = modern ? '' : 'on',

            init = function (e)
            {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem] (pre + e.type, init, false);
                if (!done && (done = true)) fn.call (win, e.type || e);
            },

            poll = function ()
            {
                try
                { root.doScroll ('left'); }
                catch (e)
                {
                    setTimeout (poll, 50);
                    return;
                }
                init ('poll');
            };

        if (doc.readyState == 'complete') fn.call (win, 'lazy');
        else
        {
            if (!modern && root.doScroll)
            {
                try
                { top = !win.frameElement; }
                catch (e)
                { }
                if (top) poll ();
            }
            doc[add] (pre + 'DOMContentLoaded', init, false);
            doc[add] (pre + 'readystatechange', init, false);
            win[add] (pre + 'load', init, false);
        }

    }
}
