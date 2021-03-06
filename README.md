> :warning: THIS REPO HAS MOVED TO https://github.com/appcelerator/appc-daemon
>
> Since all of the plugins have been moved out of this repo and into submodules, it made sense to
> just have the `appc-daemon` repo contain the plugin submodule references.

# Appc Daemon Plugins

This monorepo orchestrates plugins for the [Appc Daemon][1].

Report issues in [JIRA](https://jira.appcelerator.org/projects/DAEMON/issues).

## Installation

Plugins are installed directly from `npm`.

## Development Workflow

The plugins are located in separate repos and brought in via git submodules. To work on a plugin,
begin by forking the individual plugin repo. Next fork or clone this repo and sync the submodules.

```sh
git clone git@github.com:<YOUR GITHUB USERNAME>/appc-daemon-plugins.git
cd appc-daemon-plugins

git remote add appc git@github.com:appcelerator/appc-daemon-plugins.git
git submodule init

mv .git/config .git/config.bak
sed 's/:appcelerator\//:<YOUR GITHUB USERNAME>\//' .git/config.bak > .git/config
git submodule update

yarn
yarn run link
yarn run build
```

To get the latest changes:

```sh
git pull appc master
git submodule update
yarn
```

## Legal

This project is open source under the [Apache Public License v2][2] and is developed by
[Axway, Inc](http://www.axway.com/) and the community. Please read the [`LICENSE`][2] file included
in this distribution for more information.

[1]: https://github.com/appcelerator/appc-daemon
[2]: https://github.com/appcelerator/appc-daemon-plugins/blob/master/LICENSE
