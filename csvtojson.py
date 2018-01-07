import csv
import numpy as np
import json
from collections import defaultdict
from collections import OrderedDict

def main():

	resultjson = {'name': 'root', 'children':[]}
	file1 = open('data/occupationcount2.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	print "hello"
	ocdict = defaultdict(list)
	for row in reader:
		name = row[0]
		category = row[1]
		count = row[2]
		ocdict[category].append({'name': name, 'size': int(count)})
	
	for k,v in ocdict.iteritems():
		resultjson['children'].append({'name': k, 'children': v})
		

	with open('data/oc2.json', 'w') as outfile:
   		json.dump(resultjson, outfile)
if __name__ == "__main__":
	main()