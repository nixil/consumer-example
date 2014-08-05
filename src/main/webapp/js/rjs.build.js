({
    appDir: "${basedir}/src/main/webapp/js/",
    baseUrl: "./",
    dir: "${project.build.directory}/${project.build.finalName}/js",
    mainConfigFile: "${basedir}/src/main/webapp/js/main.js",
    optimize: "uglify",
    //optimize: "none",      //for debug only
    optimizeCss: "none",     //gulf is taking care of
    fileExclusionRegExp: /(rjs\.build\.js|^bootstrap$|^jquery$|^knockout$|^moment$|^oj$|^prettify$|^require$|^retina$|^sammy$|^mock$|^\.)/,
    skipDirOptimize: false,
    keepBuildDir: true,     //maven-ant plugin will first copy all lib js to this folder
    preserveLicenseComments: false,
    modules: [
        {
            name: "main",
            exclude: [
                "debug_option"
            ]
        },
        {
            name: "login-main",
            exclude: [
                "debug_option"
            ]
        }
    ]
})