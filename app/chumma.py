import locale

locale.setlocale( locale.LC_ALL, 'en_IN' )
p = locale.currency( 12456, grouping = True )
print(str(p))