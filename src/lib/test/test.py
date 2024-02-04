
# The majority element is the element that appears more than ⌊n / 2⌋ times. 

def majority (nums:list[int])->int:
  n = len(nums)
  # step 1: get the unique elements
  uniqueList=[]
  for element in nums:
    if(element not in uniqueList):
      uniqueList.append(element)
  currentMax=0
  currentMaxOccurrence=0
  for un in uniqueList:
    numberOfOccurence=nums.count(un)
    if numberOfOccurence >currentMaxOccurrence:
      currentMaxOccurrence=nums.count(un)
      currentMax=un
  return currentMax

  
print(majority([1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,5,5,5,5,]))