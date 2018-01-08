import csv
import numpy as np
import json
from collections import defaultdict
from collections import OrderedDict
from pprint import pprint

def main():

	routedict = defaultdict(list)
	file1 = open('data/routefirsts.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	for row in reader:
		route = row[6]
		nation = row[10]
		summitdate = row[26]
		numsummits = row[67]
		firstsummiters = row[68]
		#print len(row)
		##print route
		#print nation
		#print summitdate
		#print numsummits
		#print firstsummiters
		routedict[route] = [nation, summitdate, numsummits, firstsummiters]

	for k,v in routedict.iteritems():
		print k,v
		#pass
	print 'len: ' + str(len(routedict))
	with open('data/routes.json', 'r') as infile:
   		d = json.load(infile)
   		#pprint(d['features'][0])
   		routecount = 0
   		for obj in d['features']:
   			#pprint(obj['properties'])
   			if 'route' in obj['properties']:
   				route = obj['properties']['route']
   				print route
   				obj['properties']['nation'] = routedict[route][0]
   				obj['properties']['summitdate'] = routedict[route][1]
   				obj['properties']['numsummits'] = routedict[route][2]
   				obj['properties']['firstsummiters'] = routedict[route][3]
   				pprint(obj['properties'])
   				#routecount += 1
   		#print routecount
   			

   	with open('data/routes2.json', 'w') as outfile:
   		json.dump(d, outfile)



if __name__ == "__main__":
	main()