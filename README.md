# Coffee Machine Event B Model

The model is given here as text files. They can be imported in Rodin thanks for exampe to a text editor such as Camille.

# JeB plugin

The JeB plugin is in the file `fr.loria.dedale.bsimu-0.6.6-SNAPSHOT.jar`. To install it, simply drop it into the `dropins` directory of Rodin and relaunch it. An icon `JeB` should appear in the toolbar. Clicking on it will generate for *all* open models the JeB animation files, inside directories called `jeb`.

# Launhing Coffe Machine animation
N.B. Inside the directory called 'jeb', you will find the files generated by the *previous* version of JeB, prior to our extension.  

The JeB animation files generated by *our new version of JeB* for the Coffee Machine Model are to be found in the `jeb.zip` archive. Unzip it. The automatically generated files have been completed with user defined javascript files to provide simple graphic representations of the machines' state at the various levels of refinement. The graphic customization is ensured via the `jeb.animator.init` and `jeb.animator.draw` functions located in each of the files: `distributeur_user.js`, `distributeur1_user.js` and `distributeur2_user.js`.  

To launch a JeB animation, navigate to the `jeb`folder where you find such files as `config.json`, `init-server.sh`, `start-server.sh`, etc. To use the feature of having the events' parameter values computed by the ProbCLI constraint solver, please set the path to your ProBCLI installation in the `config.json` file. To init and start the server successively run:

- `./init-server.sh` (or `init-server.bat` if you're on the Windows platform)
- `./start-server.sh` (or `start-server.bat` if you're on the Windows platform)

The last command should answer with a message saying that `Server is running at http://localhost:3000`.

Open the location `http://localhost:3000` in your browser: you are presented with an HTML interface where you can click on any of the refinement level.

Notice that when you click on any of the contexts or machine, JeB still starts by informing you that the constants were not set but it presents you with a popping form to do so just after. The values are set automatically except for the `MAX_BAL`, `MAX_POT` and `MAX_COF` constants. You can provide for example the values `250`, `750` and `10` respectively for these constants. Click `Submit` and voilà, you are ready to animate the models.

