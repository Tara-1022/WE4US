import pandas as pd

# Create sample data
sample_data = {
    'Name': ['Tara Lukose', 'Saathwika', 'Sharon', 'Khushi', 'Kajal', 'Nishita', 'Chinnmayiee', 'Yashaswini'],
    'Email': [
        'tlukose12@gmail.com',
        'dsaathwika15@gmail.com',
        'sharongraceprabhu@gmail.com',
        'khushiumalakshmi@gmail.com',
        'kajaljotwani06@gmail.com',
        'nishitapravin2@gmail.com',
        'chinnmayie.nagam@gmail.com',
        'yashaswinisharma460@gmail.com'
    ],
    'IsAdmin': [True, False, False, False, False, True, False, False]  # Added IsAdmin field
}

# Create a DataFrame
df = pd.DataFrame(sample_data)

# Save to Excel
df.to_excel('test_users.xlsx', index=False)

print("Sample Excel file 'test_users.xlsx' created successfully.")
