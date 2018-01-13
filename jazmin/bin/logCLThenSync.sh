#!/bin/bash                                                                                                                   
#                                                                                                                             
# NOTES:                                                                                                                      
# Assumes you are in main                                                                                                     
#                                                                                                                             
# You must have an existing Directory in your home directory named CLDirectory                                                
# in order for this to work, however it will create the CL log file.                                                          
#                                                                                                                             
#This will sync to the most recent CL so...                                                                                   


# We want to have a separate log for each branch, finding name of file                                                        
DIRNAME=$(pwd | sed 's/.*app\///' | sed 's/\//./')
#append current CL to the end of CLLog for that branch                                                                        
head changelist.blt >> ~/CLDirectory/$DIRNAME.CLLog.txt
echo "" >> ~/CLDirectory/$DIRNAME.CLLog.txt

#Sync to the latest CL for that branch                                                                                        
blt --sync
