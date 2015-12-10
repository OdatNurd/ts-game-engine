/**
 * This little bit of trickery causes the TypeScript compiler to blend this interface with the one that it
 * ships with (in lib.d.ts) which describes the String constructor (the String static object).\
 *
 * This allows us to cram some extra static methods onto the class object.
 */
interface StringConstructor
{
    format(formatString : string, ... params) : string;
}

// Only attempt to include this static method if it does not already exist. This of course means that if
// it DOES already exist, our code is going to be unhappy. However, I would rather make my own code
// unstable than someone else's in this situation because I (hopefully) understand what my own code does.
if (!String.format)
{
    /**
     * Takes a format string and one or more other strings, and does a replacement, returning a copy of the
     * newly formatted string.
     *
     * The format string can contain sequences like {0} or {1} or {n}, where that text (including the braces)
     * will get replaced with the argument at that location.
     *
     * Example: String.format ("Hello, {0}", "Terence"); returns the string "Hello, Terence".
     *
     * Note that in TypeScript this sort of thing is already possible because TypeScript includes support for
     * EcmaScript 6 template strings, which it compiles down. However in some cases such strings are not
     * desirable from a readability standpoint, particularly when there are a lot of substitutions and/or the
     * expressions are lengthy.
     *
     * As such, this function is provided for use in such situations.
     *
     * @param formatString the template string to format
     * @param params the objects to use in the replacements
     * @returns {string} the formatted string
     */
    String.format = function (formatString : string, ... params) : string
    {
        return formatString.replace (/{(\d+)}/g, function (match, number)
        {
            return typeof params[number] != 'undefined'
                ? params[number]
                : match
                ;
        });
    };
}

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
        // The typecast below was added for TypeScript compatibility because HTMLElement doesn't include
        // the doScroll() method used below when the browser is IE.
        var done = false, top = true,
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
