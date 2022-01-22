# Lib template
You should: 
* Replace any occurences of LibName
* Replace any occurences of LibTitle
* Replace `site/src/images/icon.png`
* Replace `site/src/images/og.png`
* Replace `linear-gradient(` colors

---
# LibName

<p align="center">
    <a href="https://www.npmjs.com/package/LibName"><img src="https://img.shields.io/npm/v/LibName.svg?color=brightgreen" alt="npm version"></a>
    <img src="https://img.shields.io/bundlephobia/minzip/LibName.svg" alt="Gzip Size"> 
    <a href="https://github.com/gmrchk/LibName/blob/master/LICENSE"><img src="https://img.shields.io/github/license/gmrchk/LibName.svg" alt="License"></a>
</p>

- [Installation](#installation)
- [Usage](#usage)
- [API](#public-api-methods)
- [Contributions](#contributions)
- [License](#license)


## Installation
There are several options how to install LibTitle to your site. 

The first is to include LibName with scripts tag from the downloaded version available in this repository. This version will create a global `LibTitle` object which you can use to create your instance.  

```html
<script src="./dist/LibName.min.js"></script>
```

The third and most flexible option is to install with package managers like **npm** or **yarn**.

```shell
npm install LibName --save
# or 
yarn add LibName
```

Once the package is installed as a node module (eg. inside of `node_modules` folder), you can access it from `LibName` path.

```javascript
import LibTitle from 'LibName';
```

There is an advantage to the latest format, because the library is not bundled, doesn't contain boiler plate code of the bundler, doesn't pollute the global scope and is much smaller and can be effectively tree-shaked as well.

## Usage
To start LibTitle, the instance needs to be created from its class. The class is either defined globally from a standalone versions, or can be imported from a package as a default export.  

```javascript
const options = { color: 'rgb(180, 180, 180)' };
new LibTitle(options);

// or if imported from package
import LibTitle from 'LibName';

const options = { color: 'rgb(180, 180, 180)' };
new LibTitle(options);
```

## Options
As you may have noticed in a previous example, LibTitle accepts options as an argument when the instance is being created. 
Options are passed as an object.

```javascript
const LibName = new LibTitle({ option: "value" });
```

Following is a table of all available options, together with the description and default value. 

| Option | Description| Default value |
| - | - | - |
| option | ... | ... |

## API 
LibTitle has a several additional public API methods that can be used to control it programmatically. 

## Contributions
Any contributions are welcome!

Remember, if merged, your code will be used as part of a free product. 
By submitting a Pull Request, you are giving your consent for your code to be integrated into LibTitle as part of a commercial product.

## License
Check the LICENSE.md file in the root of this repository tree for closer details.
 
