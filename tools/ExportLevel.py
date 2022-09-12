#!/usr/bin/python
# coding: UTF-8
# 将整图拆分成小图，生成的小图在当前目录下

import re
import sys
import os
import xlrd

colorMap = {
	"h":1,
	"l":12,
	"j":4,
	"f":2,
	"q":5,
	"s":6,
	"v":7,
	"z":8,
	"c":9,
	"m":10,
	"k":11,
	"y":3
}

data = xlrd.open_workbook(sys.path[0]+"/../cfg/Levelzs.xls")#打开当前目录下名为01.xls的文档
#此时data相当于指向该文件的指针
table = data.sheet_by_index(0)#通过索引获取，例如打开第一个sheet表格
nrows = table.nrows
ncols = table.ncols

result = "{"
for rowNum in range(1, nrows):
	if rowNum > 1:
		result = result + ",\""+str(rowNum)+"\":["
	else:
		result = result + "\""+str(rowNum)+"\":["
	for colNum in range(1, ncols):
		value = table.cell_value(rowNum,colNum)
		print(str(rowNum) +"-"+ str(colNum))
		if value or value == 0.0:
			if colNum > 1:
				result = result + ",["
			else:
				result = result + "["
			if value == 0.0:
				result = result + "]"
			else:
				value = value.strip()
				colorArray = value.split(",")
				content = ""
				index = 1
				for color in colorArray:
					if index > 1:
						content = content + ","
					content = content + str(colorMap[color])
					index = index + 1
				result = result + content + "]"
		else:
			break;

	result = result + "]"

result = result + "}"

#print(result)

f = open("../creator/assets/resources/cfg/levelCfg.json", "w")
f.write(result)
f.close()

