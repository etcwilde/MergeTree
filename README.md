# MergeTree

Evan Wilde | University of Victoria | 2016

## MergeTrees

MergeTrees are a way of organizing commits in git repositories.
Git uses a directed-acyclic-graph to store the commit and merges.
This isn't useful for seeing how commits flow from being authored into the master
branch of the repository.

This plugin implements the Mergetree as a plugin for Bitbucket. The MergeTree has
been implemented to work with the [Linux Kernel](http://li.turingmachine.org) and is now
going to be generalized to work with other repositories as well.