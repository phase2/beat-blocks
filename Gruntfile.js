"use strict";

module.exports = function (grunt) {
  // Load grunt tasks automatically.
  require("load-grunt-tasks")(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        configFile: "conf/eslint.json"
      },
      target: ["src/**/*.js", "src/*.js", "Gruntfile.js"]
    },
    complexity: {
      generic: {
        src: ["src/*.js", "src/**/*.js"],
        options: {
          cyclomatic: 15,
          halstead: 25,
          maintainability: 80
        }
      }
    },
    mochaTest: {
      dist: {
        src: ["spec/*.js", "spec/**/*.js"]
      }
    },
    watch: {
      dist: {
        files: ["src/*.js", "src/**/*.js", "spec/**/*.js", "spec/*.js"],
        tasks: ["test", "build"]
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          standalone: "BeatBlocks"
        }
      },
      dist: {
        src: "./src/beat-blocks.js",
        dest: "./dist/beat-blocks.js"
      }
    },
    uglify: {
      dist: {
        files: {
          "dist/beat-blocks.min.js": ["dist/beat-blocks.js"]
        }
      }
    }
  });

  grunt.registerTask("test", ["complexity", "eslint", "mochaTest:dist"]);
  grunt.registerTask("build", ["browserify:dist", "uglify:dist"]);
  grunt.registerTask("default", ["test", "build", "watch"]);
};
