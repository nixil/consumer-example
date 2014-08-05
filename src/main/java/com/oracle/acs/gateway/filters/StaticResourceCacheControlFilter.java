package com.oracle.acs.gateway.filters;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This filter will add cache-control attribute to response header for static resources, including js, css, html, fonts, etc.
 *
 * @author xin.h.li@oracle.com
 */
@WebFilter(filterName = "cacheControlFilter",
        urlPatterns = {
                "*.js",
                "*.css",
                "*.html", "*.htm",
                "*.svg", "*.ttf", "*.eot", "*.woff",
                "*.png", "*.gif"
        })
public class StaticResourceCacheControlFilter implements Filter {

    private static final String CACHE_CONTROL = "Cache-Control";
    private static final String MAX_AGE_ONE_YEAR = "max-age=31104000";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        filterChain.doFilter(servletRequest, servletResponse);
        if (servletResponse instanceof HttpServletResponse) {
            ((HttpServletResponse) servletResponse).setHeader(CACHE_CONTROL, MAX_AGE_ONE_YEAR);
        }
    }

    @Override
    public void destroy() {

    }
}
