# Download of Public Facing Data

To add to the repo, first `clone` it with:

```shell
$ git clone https://github.com/jerrybonnell/csc431
```

Then, `cd` into the repository and into the `src` folder.

Make sure you download `node`. If you have Homebrew, you can do:

```shell
$ brew install node
```

To install the dependencies from  `package.json`, do:

```shell
$ npm install
```

Then you can run the server with this:

```shell
$ npm start
```

And you can view the contents in `localhost` by visiting a browser and going to this URL. Note if you change the port when you run the server, you need to change the port in the URL. The default is 3000.

```
http://localhost:PORT
```

To edit the server, edit `app.js`.

## Multimedia Data 

As part of our requirements, our server must retrieve any multimedia data 
corresponding to references we receive and, should that media data exist, 
download it. We have created some mock multimedia data and modified the
las flores schema to exercise this part of the pipeline. Here are some 
instructions to load this data into your local instance. 

`cd` into `sample_database` and find the file `sample-data-gen.py`. Open that
file in a text editor. Change the following line with your info: (fill in the
xxx's!)

```python
absolute_path = '/Users/xxx/xxx/csc431/sample_database/multimedia/'
```

Then, run: 

```shell 
$ python sample-data-gen.py 
``` 

This will generate a file called `multimedia_to_layer.data` in the current
directory. Now: 

```shell 
$ mv multimedia_to_layer.data database/
```

This will overwrite the current file in that directory. This is ok. 

To load the data into the database, first make sure your database has the 
new schemas: (will generate some errors if you have already done 
this, and that's ok)

```shell 
$ psql -U <username> -d lasflores -f createDatabase_lasFlores.sql
```

And, finally, the data: 

```shell 
$ psql -U <username> -d lasflores -f copySQL.sql
```

and don't forget to change the file location in `copySQL.sql` as well!  


## Testing

Every `.js` file you write should, if possible and the file is nontrivial, have an associated test file with it in the `app/tests` folder. This is to ensure we perform proper TDD. We will be using the `mocha` testing framework and the `chai` assertion library. To run all tests:

```shell
$ npm test
```

## References 

* [GJ.io](http://geojson.io/) checks if your geoJSON is valid 

