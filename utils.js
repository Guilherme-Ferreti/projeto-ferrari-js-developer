const utils = {
    
    appendTemplate(element, tagName, html) 
    {
        const wrappElement = document.createElement(tagName);
    
        wrappElement.innerHTML = html;
    
        element.append(wrappElement);
    
        return wrappElement;
    }, 

    getQueryString(url) 
    {
        const queryString = {};
    
        if (url) {
    
            url.split('?')[1].split('&').forEach(param => {
                
                param = param.split('=');
    
                queryString[param[0]] = decodeURIComponent(param[1]);
            });
        }
    
        return queryString;
    }
}

module.exports = utils;
