from flask import Flask, render_template_string, request
import html

app = Flask(__name__)

# Common search form template
search_form = '''
    <form action="{{ action }}">
        <input type="text" name="q" placeholder="Search..." value="{{ query }}">
        <button type="submit">Search</button>
    </form>
'''

template = '''
<!DOCTYPE html>
<html>
<head>
    <title>Search</title>
</head>
<body>
    <h1>Search Page</h1>
    ''' + search_form + '''
</body>
</html>
'''

search_results_vulnerable = '''
<!DOCTYPE html>
<html>
<head>
    <title>Search Results</title>
</head>
<body>
    <h1>Search Results (Vulnerable)</h1>
    ''' + search_form + '''
    <p>input received: {{ query | safe }}</p>
</body>
</html>
'''

search_results_secure = '''
<!DOCTYPE html>
<html>
<head>
    <title>Search Results</title>
</head>
<body>
    <h1>Search Results (Now Vulnerable)</h1>
    ''' + search_form + '''
    <p>Input received: {{ query | safe }}</p>
</body>
</html>
'''

@app.route('/')
def home():
    return render_template_string(template, action="/search", query="")

@app.route('/search')
def search_vulnerable():
    query = request.args.get('q', '')
    print(f"[VULNERABLE] Received query: {query}")
    return render_template_string(search_results_vulnerable, query=query, action="/search")

@app.route('/secure/search')
def search_secure():
    query = request.args.get('q', '')
    # Removed sanitization to make it vulnerable
    # sanitized = html.escape(query)
    print(f"[NOW VULNERABLE] Original query: {query}")
    return render_template_string(search_results_secure, query=query, action="/secure/search")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
